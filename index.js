
const unique = require('array-unique');
const date = require('date-and-time');

const knapsack = require('./knapsack')
const csv = require('./csv')
const assert = require('assert')

generateResult = (data, schedule, cleaningTime, event) => {
  result = []
  let minutes = 0

  for (let i = 0; i < schedule.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (Number(data[j].Duration) === schedule[i]) {
        meetingInfo = data.splice(j, 1)
        const startTime = date.addMinutes(event, minutes);
        meetingInfo.time = startTime
        result.push(meetingInfo);
        minutes += Number(meetingInfo[0].Duration) + cleaningTime

        break;
      }
    }
  }
  console.log(result)
}

findMinWaitOption = (timeSlots, durations, cleaningTime) => {
  let results = timeSlots.map(capacity => {
    res = knapsack.solve(capacity, durations)
    let [_, initValue] = capacity
    // reduce from result cleaning time
    res.elements = res.elements.map(item => item - cleaningTime)
    // add initial meeting time
    res.elements.push(initValue)
    return res
  })

  return calculateMin(results, timeSlots)
}

calculateMin = (results, timeSlots) => {
  let minResult = {};

  let minItem = {}
  for (let i = 0; i < timeSlots.length; i++) {
    assert(results[i].maxValue <= timeSlots[i][0])
    if (minResult || minResult > results[i].maxValue) {
      minResult = timeSlots[i][0] - results[i].maxValue
      minItem = results[i]
    }
  }
  return minItem;
}

findOptimalSchedule = (data) => {
  const afternoonStartTime = 13
  const morningStartTime = 9
  const morningTimeSlot = 3 * 60 // from 9:00 - 12:00
  const afterNoonTimeSlot = 4 * 60 // from 13:00 - 17:00
  const cleaningTime = 15
  const daysCount = 3
  let startingDay = 10
  const event = new Date(2020, 10, 10); // Initial Meeting date 

  durations = data.map((el) => Number(el['Duration']) + cleaningTime)
  uniqueDurations = unique(data.map((el) => Number(el['Duration'])))
  uniqueDurations = uniqueDurations.filter(Number) // Remove NaN elements
  let morningTimeSlots = [...uniqueDurations.map((el) => [morningTimeSlot - el, el])]

  let afterNoonTimeSlots = [...uniqueDurations.map((el) => [afterNoonTimeSlot - el, el])]
  for (let day = 0; day < daysCount; ++day) {
    event.setDate(startingDay)
    event.setHours(morningStartTime)
    minItem = findMinWaitOption(morningTimeSlots, durations, cleaningTime)
    generateResult(data, minItem.elements, cleaningTime, event)

    event.setHours(afternoonStartTime)
    minItem = findMinWaitOption(afterNoonTimeSlots, durations, cleaningTime)
    generateResult(data, minItem.elements, cleaningTime, event)
    startingDay += day
  }
}

csv.parse('data.csv', findOptimalSchedule)
//console.log(calculateMin(results, timeSlots))
