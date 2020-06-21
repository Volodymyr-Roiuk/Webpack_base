import * as $ from 'jquery';

const createAnalytics = (): object => {
    let counter: number = 0;
    let isDestroyed: boolean = false;

    const listener = (): number => counter++;

    $(document).on('click', listener);

    return {
        destroy() {
            $(document).off('click', listener);
            isDestroyed = true;
        },

        getClicks() {
            if (isDestroyed) {
                return 'Analytics is destroyed';
            }

            return counter;
        }
    }
}

window['analytics'] = createAnalytics();