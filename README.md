# Protobox

An opinionated prototyping boilerplate for Codesandbox's Devbox or local development.

- [x] React / Vite
- [x] Tailwind
- [x] CSS Modules
- [x] Framer Motion
- [x] Lucide icons
- [x] Hotkeys
- [x] Faker
- [x] Typescript
- [x] React Router
- [x] Custom easing curves
- [x] Hooks: ([usehooks-ts](https://usehooks-ts.com/) and [uihooks](https://usehooks.com/))
- [x] [clsx](https://www.npmjs.com/package/clsx) for classnames
- [ ] [shadcn](https://ui.shadcn.com/) components

## Usage

- [Open in Codesandbox](https://codesandbox.io/p/devbox/github/toddmoy/protobox)
- [Use repo template](https://github.com/new?template_name=protobox&template_owner=toddmoy)

## Tips & Tricks

### Add a component

Using shadcn:

```
npx shadcn-ui@latest add button
```

then use it like so:

```
import { Button } from "@/components/ui/button"
...

<Button>Click me</Button>
```

### Add a keyboard shortcut

import the package and add this into the component:

```
useHotKeys('ctrl+/', () => { alert("hi") })
```

### Add an icon

We use `react-icons` to easily insert icons from different libraries. [Browse
icons](https://react-icons.github.io/react-icons/)

```
import { FiBox } from "react-icons/fi"

...

<FiBox size={40} />
```

### Use animation

```
import { motion } from 'framer-motion'

<motion.div animate={{y:-20}}>...</motion.div>
```

### Use modules

CSS modules make it easy to use generic classnames without fear they will have side effects.

1. Create a file `<Name>.module.css`
2. Import it `import styles from `./path/to/<Name>.module.css`
3. Use it `class={styles.<classname>}`

# Use fake data

Fake data generation is provided by [FakerJS](https://fakerjs.dev/guide/usage.html)

```
import { faker } from '@faker-js/faker'

const name = faker.person.fullName()
```

# Add a page

Routing is provided by [React Router](https://reactrouter.com/en/main/start/tutorial).

# Position something relative to another

Use the `usePosition` hook. Make sure the positioned element has a predictable width.

```
import usePosition from "./hooks/usePosition"

const buttonRef = useRef(null)
const { ref: menuRef, style } = usePosition(buttonRef, {
  position: 'left',
  alignment: 'start',
})

<button ref={buttonRef}>Target</button>

<div ref={menuRef} className="w-52" style={style}>Tooltip</div>
```

// App.jsx

<Routes>
...
  <Route path="/foo" component={Foo} />
...
</Routes>
```
