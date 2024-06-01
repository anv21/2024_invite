function changeImage () {
  document.getElementById('endCount').style.display = 'flex'
  document.getElementById('main').style.display = 'none'
}

class CountdownTracker {
  constructor (label, value) {
    this.el = document.createElement('span')
    this.el.className = 'flip-clock__piece'
    this.el.innerHTML = `
      <b class="flip-clock__card card">
        <b class="card__top"></b>
        <b class="card__bottom"></b>
        <b class="card__back">
          <b class="card__bottom"></b>
        </b>
      </b>
      <span class="flip-clock__slot">${label}</span>
    `

    this.top = this.el.querySelector('.card__top')
    this.bottom = this.el.querySelector('.card__bottom')
    this.back = this.el.querySelector('.card__back')
    this.backBottom = this.el.querySelector('.card__back .card__bottom')

    this.currentValue = null
    this.update(value)
  }

  update (val) {
    val = (`0${val}`).slice(-2)
    if (val !== this.currentValue) {
      if (this.currentValue !== null) {
        this.back.setAttribute('data-value', this.currentValue)
        this.bottom.setAttribute('data-value', this.currentValue)
      }
      this.currentValue = val
      this.top.innerText = this.currentValue
      this.backBottom.setAttribute('data-value', this.currentValue)

      this.el.classList.remove('flip')
      void this.el.offsetWidth // Force reflow
      this.el.classList.add('flip')
    }
  }
}

class Clock {
  constructor (countdown, callback) {
    this.countdown = countdown ? new Date(Date.parse(countdown)) : false
    this.callback = callback || function () {}

    this.el = document.createElement('div')
    this.el.className = 'flip-clock'

    this.trackers = {}
    const remainingTime = this.getTimeRemaining(this.countdown)

    for (const key in remainingTime) {
      if (key !== 'Total') {
        this.trackers[key] = new CountdownTracker(key, remainingTime[key])
        this.el.appendChild(this.trackers[key].el)
      }
    }

    this.i = 0
    setTimeout(() => this.updateClock(), 500)
  }

  getTimeRemaining (endtime) {
    const now = new Date()
    const remainingTime = Date.parse(endtime) - Date.parse(now)
    return {
      Total: remainingTime,
      Days: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
      Hours: Math.floor((remainingTime / (1000 * 60 * 60)) % 24),
      Minutes: Math.floor((remainingTime / 1000 / 60) % 60),
      Seconds: Math.floor((remainingTime / 1000) % 60)
    }
  }

  updateClock () {
    requestAnimationFrame(() => this.updateClock())

    // Throttle so it's not constantly updating the time.
    if (this.i++ % 10) return

    const remainingTime = this.getTimeRemaining(this.countdown)
    if (remainingTime.Total < 0) {
      cancelAnimationFrame(this.timeinterval)
      for (const key in this.trackers) {
        this.trackers[key].update(0)
      }
      this.callback()
      return
    }

    for (const key in this.trackers) {
      this.trackers[key].update(remainingTime[key])
    }
  }
}

const deadline = new Date(Date.parse('2024/06/28'))
const clock = new Clock(deadline, changeImage)
document.getElementById('flip_timer').appendChild(clock.el)
