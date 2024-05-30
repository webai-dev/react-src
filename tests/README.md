# E2E tests
We are using [test cafe](https://devexpress.github.io/testcafe/documentation/getting-started/) for E2E tests.

**Use `data-test` attribute to find element in project code**

Please use `data-test` as attribute to select html element for tests. That will make them more reliable:
Note that attribute will not be included on production build

```react
import TEST_IDS from '../../../../tests/testIds';

const TestComponent = () => (
    <div data-test={ TEST_IDS.PLACEMENT_ROUTE_ID }>
        E2E test will click here
    </div>
)

export default TestComponent
```

```javascript
import { ClientFunction } from 'testcafe';
import TEST_IDS           from './testIds';

fixture`Getting Started`
    .page`http://localhost:8080/`;

const getLocation = ClientFunction(() => document.location.href);

test('Click placement route button', async t => {
    await t
        .click(`[data-test="${ TEST_IDS.PLACEMENT_ROUTE }"]`)
        .contains('placement/new');
});
```

**Use `Selector` to find element in others site by text of the button**
```javascript
import { ClientFunction, Selector }  from 'testcafe';

fixture`Getting Started`
    .page`http://localhost:8080`;

test('Click recruiter <a>', async t => {
    await t
        .click(Selector('a').withText('Recruiter'))
});

```
**Use `getPathName` to get pathName from url and `validateRoute` to check is route was created by provided ROUTES.VALUE**
```javascript

test('Validate path', async t => {
    await t
        .useRole(employerUser);

    const pathName = await getPathName();
    const isRouteValid = validateRoute(pathName, ROUTES.DASHBOARD);

    await t
        .expect(isRouteValid)
        .ok('Route is wrong');
});

```