# Protobox

An opinionated prototyping boilerplate for Codesandbox's Devbox.

- [x] React / Vite
- [x] Tailwind
- [ ] Storybook
- [x] CSS Modules
- [x] Framer Motion
- [x] Feather icons

## Usage

[Open in Codesandbox](https://codesandbox.io/p/devbox/github/toddmoy/protobox)

## Tips & Tricks

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
