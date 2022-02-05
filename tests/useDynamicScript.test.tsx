import React from 'react';
import renderer from 'react-test-renderer';
import { useDynamicScript } from '../src/custom-hooks/useDynamicScript';

const MockComponent: React.FC = () => {
    useDynamicScript('http://localhost:9997/remoteEntry.js');
    return (<div/>);
}

describe('useDynamicScript Test Suite', () => {
    test('it appends a script tag to the dom, and reflects the accurate state of the script appending', (done) => {
        renderer.create(<MockComponent />);

        setTimeout(() => {

            const scriptArr = document.querySelectorAll('head script');
            let flag = false;
            for (const script of Array.from(scriptArr)) {  
                if (script.getAttribute('src') === 'http://localhost:9997/remoteEntry.js') {
                    flag = true;
                }
            }

            expect(flag).toBe(true);
            done();
        }, 1000)

    })
});