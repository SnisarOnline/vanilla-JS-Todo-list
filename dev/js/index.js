/**
 * Приблизительно затраченное время. 2 дня.
 *
 */

window.onload = function () {
    const base = [
        {
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, ipsum! 10',
            date: createNewDate('15.02.2000 19:35:40'),
            done: true
        },{
            text: ' Lorem ipsum dolor sit amet, consectetur adipisicing. 7',
            date: createNewDate('55.02.2000 19:35:40'),
            done: true
        },{
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cum dignissimos eligendi est et ex, excepturi explicabo facere nihil non. 20',
            date: createNewDate('25,10,1989'),
            done: false
        },{
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cum dignissimos eligendi est et ex, excepturi explicabo facere nihil non. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cum dignissimos eligendi est et ex, excepturi explicabo facere nihil non. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cum dignissimos eligendi est et ex, excepturi explicabo facere nihil non. 20',
            date: createNewDate('45,10,1989'),
            done: false
        },
    ];
    localStorage.setItem( 'todoBase', JSON.stringify(base) );

    outputElement();
};


//================================================================//
//********** Работа с базой **************************************//
//================================================================//
/**
 * Получим из базы
 * @returns {*[]}
 */
function getBase() {
    return JSON.parse(localStorage.getItem('todoBase'));
}
/**
 * Добавление в базу
 * @param newBase {object} новый в базу
 */
function setBase(newBase) {
    let BASE = getBase();
    BASE.push(newBase);
    localStorage.setItem( 'todoBase', JSON.stringify(BASE) );
}

/**
 * Удалить из базы
 * @param id {number}
 */
function dellBase(id) {
    let BASE = getBase();
    BASE.splice(id, 1);
    localStorage.setItem( 'todoBase', JSON.stringify(BASE) );
}



//================================================================//
//********** Работа с страницей **********************************//
//================================================================//
/**
 * Выводим все такски на страницу
 */
function outputElement() {
    let mainList = document.getElementById('main-list');
    const BASE = getBase();

    let htmlList = `
                <li class="list-task" >
                    <div >
                        <p>Статус Задачи</p>
                    </div>
                    <div  >
                        <p>Текст Задачи</p>
                    </div>
                    <div  >
                        <p>Время Дедлайна</p>
                    </div>
                    <div >
                        <p>Кнопки</p>
                    </div>
                </li>
                `;

    BASE.forEach( (item, i, arr)=> {
        htmlList += compileElement(item, i);
    });
    mainList.innerHTML = htmlList;
}

/**
 * Создаем новый таск
 * @param event EVENT
 */
function newElement(event) {
    event.preventDefault();

    const form = document.forms['mainForm'];
    let formCheckbox = form.elements['done'].checked;

    if( checkText(form.elements['text']) && checkDate(form.elements['date']) ) {

        let newTask = {
            text: '',
            date: '',
            done: false
        };

        newTask.done = formCheckbox;
        newTask.text = form.elements['text'].value;
        newTask.date = createNewDate(form.elements['date'].value);

        setBase(newTask);
        outputElement();
    } else {
        console.log( 'Проверте валидность форм' );
    }
}

/**
 * Удалим таск
 * @param id {number}
 */
function dellElement(id) {
    dellBase(id);
    outputElement();
}



//================================================================//
//********** Вспомагательные *************************************//
//================================================================//
/**
 * Собираем каждый таск отдельно
 */
function compileElement(baseDate, id) {

    let task = `
        <li class="list-task">
            <div class="task-icon" >
              <i class="fa ${baseDate.done ? 'fa-check' : 'fa-times'} "></i>
            </div>
            <div class="task-text" >
                <p>${baseDate.text}</p>
            </div>
            <div class="task-time" >
                <p>${baseDate.date}</p>
            </div>
            <div class="task-button" >
                <input type="button" value="dell" onclick="dellElement(${id})">
            </div>
        </li>
    `;
    return task;
}

/**
 * Проверка валидности форм
 */
function checkText(input) {
    input.classList = '';
    let text = input.value;

    const RegExp =  /[!%&#\\^*?\/~="';:+]/;

    if ( text == '' ) {
        input.classList = 'err';
        return false;
    } else if ( text.length < 5 ) {
        input.classList = 'err';
        return false;
    } else if ( RegExp.test(text) ) {
        input.classList = 'err';
        return false;
    }

    return true;
}
function checkDate(input) {
    input.classList = '';
    let date = input.value;

    const RegExpERR =  /[!%&#\\^*?\/~="'+]/;
    const RegExpSplit =  /[.,:; ]/;

    if ( RegExpERR.test(date) ) {
        console.log( `Удалите запрещенные символы ${RegExpERR} ` );
        input.classList = 'err';
        return false;
    }

    let arrDate = date.split(RegExpSplit);

    if (arrDate.length < 3) {
        console.log( 'Недостаточно точное время' );
        input.classList = 'err';
        return false;
    }

    return true;
}


/**
 * Создаем проверенную и валидную дату
 * @param input {string}
 * @returns {string}
 */
function createNewDate(input) {

    const RegExpSplit =  /[.,:; ]/;
    let arrDate = input.split(RegExpSplit);

    let setDate = {
        year: arrDate[2],
        month: checkMonth(arrDate[1]),
        day: arrDate[0],
        hour: arrDate[3] || 0,
        minute: arrDate[4] || 0,
        second: arrDate[5] || 0
    };

    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return  new Date( setDate.year, setDate.month, setDate.day, setDate.hour, setDate.minute, setDate.second).toLocaleString("ru", options);
}
/**
 * Отсчет месяцев начинается с нуля 0.
 * @param mouth {string|number} Месяц указанный пользователем
 * @returns {number} вернем номер месяца
 */
function checkMonth(mouth){
    // let months_ru = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    let months_es = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if( isNaN( Number(mouth) )){
        // console.log( 'mouth is string ' );
        let mouthNumber = '';

        // поиск совпадения названия месяца
        for (var j=0; j<months_es.length; j++) {
            if (months_es[j].match(mouth)) mouthNumber = j;
        }

        return Number(mouthNumber) ? mouthNumber : 0;
    } else {
        // console.log( 'mouth is number ' );
        return mouth > 0 ? mouth - 1 : 0;
    }
}






