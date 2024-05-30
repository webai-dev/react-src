## GTM readme
We are using [GTM](https://tagmanager.google.com) to track user actions.
And [GA](https://analytics.google.com) to display statistic.

- if you want to know how to connect GTM to GA read [this](https://support.usabilla.com/hc/en-us/articles/360015738812-Integration-with-Google-Analytics-using-GTM-Data-Layer)
- [gtmPush util](./gtmPush.js)
- [here](../../../public/index.html) is GTM setup for local development
- [here](../../../templates/base.html.twig) is GTM setup for production development

### GTM usage example
```
import gtmEventPush, {GTM_EVENTS, GTM_LABELS} from '../util/gtmEventPush';

gtmEventPush(
    {
        event: GTM_EVENTS.CLICK_SEARCH_RESULT,
        label: GTM_LABELS.SEARCH,
        value: 'someRecruiterId',
    }
)
```
