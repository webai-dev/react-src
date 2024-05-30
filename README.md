## General code styles and project structure

- we use only `.js` if you see `.jsx` it is legacy and requires refactoring
- we are importing directly from file. 
    - Correct: `import getQueryString from '../../../util/getQueryString';`
    - Wrong: `import { getQueryString } from '../../../util';`
- [utils](./util) - different helper functions.
- [icons](./assets/icons) - We only use svg icons. I highly recommend only use [this site](https://iconmonstr.com/about/) to get icons (it is totally free).  No png, no jpeg etc.
- [images](./assets/images) - Folder for images (png, jpeg, etc). Don't place icons here!
- [mutations](./mutations) - Legacy folder mutation should be inside container that uses it.
- [old styles](./style) - Legacy folder. Bootstrap was used at the beginning. We should remove it and remove reactstrap (too heavy).
- [new styles](./assets/scss/README.md) - readme.
- [store](./stores) - It would be better to get rid of that store. But for now it is ok.
- [ui](./ui) - folder with pages, components and containers

###Layout, Pages, containers and components
Note: Right now pages, containers and components are messy and requires cleaning.

**[Pages](./ui/pages)** - Has to be use inside [Routing](./Routing.js) through Loadable. Other wise it is not a page. When creating a page create all child components and containers inside page folder. Unless you 100% sure that child component will be use by other page in future (i.e ButtonComponent, LoaderComponent, etc).
One page may be associated with several routes. Don't create new page for different route if it very similar to existed page.
May contain both Containers and Components.

**[Containers](./ui/containers)** - Contain app logic such as fetching data from server or sending mutations to server. Should not contain styles and markup at all!.
May contain both Containers and Components.
Should end on `...Container`

**[Components](./ui/components)** - Should contains only styles. No graphql. Only methods from parent component.
Should end on `...Component`

###Development working process
Imagine You create reviews page. You should create corresponding folder [here](./ui/pages). For example you will need **reviewComponent** and **reviewTitle**. You should place them inside your page folder.

Imagine you need to create another page: widget. And you realize you can reuse **reviewComponent** from reviews page. Only in that case you move **reviewComponent** to [components](./ui/components).

Same logic applied to containers
