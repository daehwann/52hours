function init() {
  document.getElementById('username').value = Cookies.get('username') || getQueryVariable('u') || '';
  setDatetimeLimit();
  setDatetime();

  getHistory();
}

function getHistory() {
  // remove all
  var historyEl = document.getElementById('history');
  _.forEach(historyEl.childNodes, function (el) {
    
  })
  var history = Cookies.get('h')
  if (history) {
    history.split('|')
      .filter(function (v) { return !!v && v != 'undefined' })
      .sort(function (a, b) {
        return b.localeCompare(a)
      })
      .forEach(function (d) {
        var li = document.createElement('li');
        li.textContent = d;
        li.class='mdc-list-item mdc-ripple-upgraded';

        document.getElementById('history').append(li);
      });
  }
}

function setDatetimeLimit() {
  var d = document.getElementById('datetime')
  var today = new Date()
  d.min = '2018-10-01T00:00:00'
  d.max = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T' + today.getHours() + ':00:00'
}

function setDatetime(date) {
  date = date || new Date()
  document.getElementById('datetime').valueAsNumber = date.getTime() - (date.getTimezoneOffset() * 60 * 1000);
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return undefined;
  console.log('Query variable %s not found', variable);
}

function submit() {
  // Time Check
  var username = document.getElementById('username').value
  var date = new Date(document.getElementById('datetime').value + '+09:00');

  if (!username) {
    return alert('Name?');
  } else {
    Cookies.set('username', username, { expires: 365 });
  }

  var regularTime = new Date(new Date(date.getTime()).setHours(18, 00, 00));
  var overtime = Math.floor((date - regularTime) / 1000 / 60 / 60)


  if (!confirm(date.toLocaleString() + '\n초과:' + overtime + '시간' + ' 맞나요?')) {
    return;
  }

  // var ACTION_PATH = 'https://docs.google.com/forms/d/e/1FAIpQLScp5JzRN86jDgwsDW2xbbvNoiBS7kt8tBZTJW5MV-iykKd5Vg/formResponse' // 임시
  var ACTION_PATH = 'https://docs.google.com/forms/d/e/1FAIpQLSc8cUWGrPDHMD7X_JyxrhcqhqkPmALQOsdRR5MZuklvGpCkUA/formResponse' //진짜

  var f = document.createElement('form')
  f.setAttribute('method', 'POST')
  f.setAttribute('action', ACTION_PATH)
  f.target = 'submitresult'
  f.style = 'display:none;'

  var param = {
    'entry.1065843082_year': date.getFullYear(),
    'entry.1065843082_month': date.getMonth() + 1,
    'entry.1065843082_day': date.getDate(),
    'entry.1467693251': username,
    'entry.2119704746_hour': 09,
    'entry.2119704746_minute': 00,
    'entry.680657899_hour': date.getHours(),
    'entry.680657899_minute': date.getMinutes(),
    'entry.1760268447_hour': overtime > 0 ? overtime : 0,
    'entry.1760268447_minute': 00,
    fvv: 1,
    pageHistory: 0
  }

  /*** TEST FORM ***/
  // var param = {
  //   'entry.49582767_year': today.getFullYear(),
  //   'entry.49582767_month': today.getMonth()+1,
  //   'entry.49582767_day': today.getDate(),
  //   'entry.2048335593': username,
  //   'entry.1435532183_hour': 01,
  //   'entry.1435532183_minute': 00,
  //   fvv: 1,
  //   pageHistory: 0
  // }

  for (var key in param) {
    var el = document.createElement('input');
    el.name = key;
    el.value = param[key];
    f.append(el);
  }

  document.body.append(f);

  // last message
  alert('Go Home !!');

  // set history
  var ymd = date.toISOString().replace(/T.*/, '')
  Cookies.set('h', Cookies.get('h') + '|' + ymd, { expires: 365 });

  //for testing
  if (/surge.sh/.test(location.hostname)) {
    f.submit();
    document.getElementById('submitresult_area').style = 'display:block'
  } else {
    alert('form submitted')
  }



}