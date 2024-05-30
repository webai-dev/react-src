## Router readme
We are using [react router](https://reacttraining.com/react-router/web/guides/quick-start) to handle routes.

- If you are not confident how to create your own route please check
[Path-to-RegExp](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) library documentation first
- USE CONSTANTS when creating new ROUTES: `to={ROUTES.GOOD_ROUTE}`. And don't do like this:  ~~`to="/route-that-will-be-buggy"`~~
- ROUTES constant is here: [constants.js](./constants.js)
- Avoid using magical strings inside `ROUTES` constant too: `PLACEMENTS_EDIT: '/placement/:${PARAM_ID}/edit'`. Bad example: ~~`PLACEMENTS_EDIT: '/placement/:id/edit'`~~
- if you need more complicated example check this constant `COMPANY_USERS:` `/company/users/:${PARAM_TEAM_TAB._NAME}(${PARAM_TEAM_TAB.ACTIVE}|${PARAM_TEAM_TAB.REQUEST})/:id?`
- often you need some specific link use `generatePath` for this and constants like `PARAM_ID` and `PARAM__TEAM_TAB`

### Path generation example
```javascript
history.push(
    generatePath(
        ROUTES.AGENCY_PROFILE,
        {
            [ PARAM_SLUG ]: slug,
            [ PROFILE_MODAL._NAME ]: PROFILE_MODAL.REVIEW,
            [ PARAM_REVIEW_ID ]: review.reviewId,
        },
    )
)
```
