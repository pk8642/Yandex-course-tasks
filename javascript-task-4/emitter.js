'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const subscriptions = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} slides
         * @param {Number} frequency
         * @returns {Object}
         */
        // eslint-disable-next-line max-params
        on: function (event, context, handler, slides = Infinity, frequency = 1) {
            if (!(event in subscriptions)) {
                subscriptions[event] = [];
            }

            subscriptions[event].push(
                {
                    context,
                    handler,
                    slides,
                    frequency,
                    timesCalled: 0 // количество вызванных функций (необязательно выполнившихся)
                    // если частота не позволит, то функция не выполнится, но +1 вызов запишется
                });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            const eventsToDecrease = Object.keys(subscriptions)
                .filter(action => action.startsWith(`${event}.`) || action === event);
            // события, от которых надо отписать context

            eventsToDecrease.forEach(eventToDecr => {
                subscriptions[eventToDecr] = subscriptions[eventToDecr]
                    .filter(student => student.context !== context);
                // в каждом событии отфильтровать по context, не выбирая те, которые на отписку
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            while (event) {
                if (event in subscriptions) {
                    subscriptions[event]
                        .filter(person => person.slides > 0)// если <=0, то концентрация закончилась
                        .forEach(student => {
                            if (student.timesCalled % student.frequency === 0) {
                            // каждое подходящее по частоте n событие делится на частоту без остатка
                                student.handler.call(student.context);
                                student.slides--;// минус слайд для просмотра (не для Infinity)
                            }
                            student.timesCalled++; // функция была вызвана, +1 к вызовам
                        });
                }
                event = event.substr(0, event.lastIndexOf('.'));// отсекаем хвост с последней точкой
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            return (times > 0)
                ? this.on(event, context, handler, times)
                : this.on(event, context, handler); // в методе on будут установлены дефолты
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            return (frequency > 0)
                ? this.on(event, context, handler, Infinity, frequency)
                : this.on(event, context, handler); // в методе on будут установлены дефолты
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
