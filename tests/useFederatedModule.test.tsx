import React from 'react';
import renderer from 'react-test-renderer';
import { useFederatedModule } from '../src/custom-hooks/useFederatedModule';


const MockComponent = () => {
    const url = 'http://localhost:9997/remoteEntry.js';
    const scope = 'mockModFedServer';
    const module = './Data';
    const { data, error, isLoading} = useFederatedModule(url, scope, module);

    if (isLoading) return <div>loading</div>;

    if (error) return <div>error</div>;

    return (
        <div>{JSON.stringify(data)}</div>
    );
};

describe('use federated module test suite', () => {
    test('it loads remote data', (done) => {
        const component = renderer.create(<MockComponent />);
        
        setTimeout(() => {
            expect(component.toJSON()).toMatchSnapshot();
            done();
        }, 3000);

    })
})