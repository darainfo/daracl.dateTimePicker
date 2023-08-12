# data-datetimepicker
An easy to use lightweight javascript calendar library.

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)  
--- | --- | --- | --- | --- |  
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |  


# Installation

```bash
npm install dara-datetimepicker
```
OR
```bash
yarn add dara-datetimepicker
```
or download [zip](https://github.com/darainfo/dara-datetimepicker/releases)

# start 
```bash
npm start
```

# build
```bash
npm run build

```


# datetimepicker 사용방법
```
// language 
DaraDateTimePicker.setMessage({
    year: '년',
    month: '월',
    day: '일',
    am: "오전",
    pm: "오후",
    today: '오늘',
    ok: '선택',
    months: {
    full: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    abbr: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    },
    weeks: {
    full: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
    abbr: ["월", "화", "수", "목", "금", "토", "일"]
    },
});

// mode=date
new DaraDateTimePicker('#dateText', {
    initialDate: '2023-08-10' // init date
    , format: 'YYYY-MM-DD'
    , mode: 'date'
    , minDate: DaraDateTimePicker.parser('2023-08-05')
    , maxDate: DaraDateTimePicker.parser('2050-09-30')
    , onChange: (dt) => {
        console.log(dt);
        //return false; 
    }
    , zIndex: 1000
    },{
    ok:"Ok"
})

// mode=datetime
new DaraDateTimePicker('#datetimeText',{initialDate:new Date(),format: 'YYYY-MM-DD HH:mm',  mode: 'datetime'});

// mode=time
new DaraDateTimePicker('#timeText',{initialDate:new Date(),format: 'HH:mm', mode: 'time'});

// mode=month
new DaraDateTimePicker('#monthText',{initialDate:new Date(),format: 'YYYY-MM', mode: 'month'});

// mode=year
new DaraDateTimePicker('#yearText',{initialDate:new Date(),format: 'YYYY', mode: 'year'});

// mode=datetime embed
new DaraDateTimePicker('#date', {
    isEmbed: true
    , mode: 'datetime'
    , minDate: DaraDateTimePicker.parser('2023-08-05')
    , maxDate: DaraDateTimePicker.parser('2025-09-30')
    , onChange: (dt) => {
        console.log(dt);
    }
    , zIndex: 1000
})

```   
  

# Options
| key | Desc | Default | Option |
|-----|------|-----|-----|
| isEmbed | embed  | false |  |
| initialDate |  initial date |  new Date() |  |
| mode | view mode |   date   |  year, month, date, datetime, time
| headerOrder |  month year order |  'month,year' | 'month,year'  |
| format |  date format |  'YYYY-MM-DD' | |
| zIndex |  css z-index | 1000 | |
| autoClose |  auto close |  true | true, false |
| minDate |  minimum date |  '' | |
| maxDate |  maximum date |  '' | |
| onLoad |  post-load event |   | |
| onChange |  date change event |  | |   


# Lanauage
| key | Desc | Default |
|-----|------|-----|
| year | year | Year |
| month | Month |  Month |
| day | Day |   Day   |
| am | AM |  AM |
| pm | PM |  PM |
| today | Today button |  Today |
| ok | H:M Ok button |Ok|
| months | Months |   | 
|  |  full  | ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]  | 
|  |  abbr  | ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']  | 
| weeks |  weeks |  |
|  |  full | ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] |
|  |  abbr |["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]  |


