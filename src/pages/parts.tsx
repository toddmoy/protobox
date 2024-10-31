import { FiBox } from 'react-icons/fi'
import { useState } from 'react'
import Tag from '../components/Tag'
import Input from '../components/Input'
import Button from '../components/Button'
import Toggle from '../components/Toggle'

const Parts = () => {
  const [toggleState, setToggleState] = useState(false)
  return (
    <main className="flex flex-col gap-10 py-10">
      <h1 className="mx-10">Parts</h1>
      <section className="mx-10 flex flex-col gap-5">
        <header>
          <h2>&lt;Tag /&gt;</h2>
          <div className="opacity-50 text-sm flex gap-4">
            {[
              'label',
              'isRemovable',
              'icon',
              'color',
              'className',
              'style',
              'size',
              'onClick',
              'onRemove',
            ].map((prop, key) => (
              <code key={key} className="text-[12px]">
                {prop}
              </code>
            ))}
          </div>
        </header>
        <div className="flex gap-4 items-start bg-zinc-900/5 rounded-lg p-10">
          <Tag />
          <Tag color="red" />
          <Tag isRemovable />
          <Tag icon={<FiBox />} />
          <Tag size="medium" />
        </div>
      </section>
      <section className="mx-10 flex flex-col gap-5">
        <header>
          <h2>&lt;Button /&gt;</h2>
          <div className="opacity-50 text-sm flex gap-4">
            {[
              'label',
              'leadingIcon',
              'trailingIcon',
              'className',
              'style',
              'color',
            ].map((prop, key) => (
              <code key={key} className="text-[12px]">
                {prop}
              </code>
            ))}
          </div>
        </header>
        <div className="flex gap-4 items-start bg-zinc-900/5 rounded-lg p-10">
          <Button />
          <Button color="red" />
          <Button leadingIcon={<FiBox />} trailingIcon={<FiBox />} />
          <Button disabled />
        </div>
      </section>
      <section className="mx-10 flex flex-col gap-5">
        <header>
          <h2>&lt;Input /&gt;</h2>
          <div className="opacity-50 text-sm flex gap-4">
            {['placeholder', 'leadingIcon', 'trailingIcon', 'onChange'].map(
              (prop, key) => (
                <code key={key} className="text-[12px]">
                  {prop}
                </code>
              )
            )}
          </div>
        </header>
        <div className="flex gap-4 items-start bg-zinc-900/5 rounded-lg p-10">
          <Input />
          <Input placeholder="Placeholder" leadingIcon={<FiBox />} />
          <Input placeholder="Placeholder" trailingIcon={<FiBox />} />
        </div>
      </section>
      <section className="mx-10 flex flex-col gap-5">
        <header>
          <h2>Toggle</h2>
          <div className="opacity-50 text-sm flex gap-4">
            {[
              'label',
              'checked',
              'onChange',
              'className',
              'style',
              '...checkbox props',
            ].map((prop, key) => (
              <code key={key} className="text-[12px]">
                {prop}
              </code>
            ))}
          </div>
        </header>
        <div className="flex gap-4 items-start bg-zinc-900/5 rounded-lg p-10">
          <Toggle
            checked={toggleState}
            onChange={() => setToggleState(!toggleState)}
          />
          <Toggle
            checked={toggleState}
            onChange={() => setToggleState(!toggleState)}
            disabled
          />
          <Toggle
            label="Label"
            checked={toggleState}
            onChange={() => setToggleState(!toggleState)}
          />
        </div>
      </section>
    </main>
  )
}

export default Parts
