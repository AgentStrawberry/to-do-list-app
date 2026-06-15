const HOLIDAYS = [
  { month: 1,  day: 1,  phrases: ["Happy New Year.", "Fresh start.", "Year one, day one.", "New year, new list."] },
  { month: 2,  day: 14, phrases: ["Happy Valentine's Day.", "Love is in the air.", "Be mine?"] },
  { month: 3,  day: 17, phrases: ["Happy St. Patrick's Day.", "Feeling lucky?", "Go on then."] },
  { month: 7,  day: 4,  phrases: ["Happy Fourth.", "Land of the free.", "Fireworks later."] },
  { month: 10, day: 31, phrases: ["Happy Halloween.", "Boo.", "Trick or treat."] },
  { month: 12, day: 24, phrases: ["Christmas Eve.", "Almost there.", "One more sleep."] },
  { month: 12, day: 25, phrases: ["Merry Christmas.", "Ho ho ho.", "Happy Christmas."] },
  { month: 12, day: 31, phrases: ["New Year's Eve.", "Last day of the year.", "Almost midnight."] },
]

const TIME_PHRASES = {
  morning:   ["Good morning.", "Rise and shine.", "Morning.", "Early bird.", "Up and at 'em.", "Another day."],
  afternoon: ["Good afternoon.", "Afternoon.", "Hello there.", "Hope the day's going well.", "Midday check-in."],
  evening:   ["Good evening.", "Evening.", "Winding down?", "Hope it was a good one.", "Almost done for the day."],
  night:     ["Still up?", "Night owl.", "Burning the midnight oil.", "Late night grind.", "Quiet hours."],
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getGreeting() {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours()

  if (month === 11) {
    const thursdays = []
    for (let d = 1; d <= 30; d++) {
      if (new Date(now.getFullYear(), 10, d).getDay() === 4) thursdays.push(d)
    }
    if (day === thursdays[3]) return pick(["Happy Thanksgiving.", "Give thanks.", "Hope you're with family."])
  }

  const holiday = HOLIDAYS.find(h => h.month === month && h.day === day)
  if (holiday) return pick(holiday.phrases)

  if (hour >= 5  && hour < 12) return pick(TIME_PHRASES.morning)
  if (hour >= 12 && hour < 17) return pick(TIME_PHRASES.afternoon)
  if (hour >= 17 && hour < 22) return pick(TIME_PHRASES.evening)
  return pick(TIME_PHRASES.night)
}

const COMPLETION_PHRASES = [
  "nice.", "done.", "got it.", "one less thing.", "onward.",
  "ticked off.", "sorted.", "moving on.", "there we go.", "noted.", "check.",
]

export function getCompletionPhrase() {
  return COMPLETION_PHRASES[Math.floor(Math.random() * COMPLETION_PHRASES.length)]
}
