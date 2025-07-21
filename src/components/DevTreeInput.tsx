import { Switch } from '@headlessui/react'
import { DevTreeLink } from "../types"
import { classNames } from '../utils'

type DevTreeInputProps = {
    item: DevTreeLink
    handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleEnableLink: (socialNetwork: string) => void
}

export default function DevTreeInput({ item, handleUrlChange, handleEnableLink }: DevTreeInputProps) {

 return (
    <div className="bg-white shadow-md p-4 rounded-xl flex items-center gap-4 transition duration-300">
        <a
            href={item.url || `https://www.${item.name}.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-gray-100 bg-center bg-no-repeat bg-contain flex-shrink-0 hover:scale-105 transition-transform duration-200"
            style={{ backgroundImage: `url('/social/icon_${item.name}.svg')` }}
            aria-label={`Visitar ${item.name}`}
        />

        <input
            type="text"
            className="flex-1 border border-gray-300 focus:border-blue-400 focus:ring-blue-200 focus:ring-2 rounded-lg px-4 py-2 text-sm transition duration-200"
            value={item.url}
            onChange={handleUrlChange}
            name={item.name}
            placeholder={`https://${item.name}.com/tu-perfil`}
            aria-label={`URL de tu perfil de ${item.name}`}
        />
        <Switch
            checked={item.enabled}
            name={item.name}
            onChange={() => handleEnableLink(item.name)}
            className={classNames(
                item.enabled ? 'bg-blue-500' : 'bg-gray-300',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
        >
            <span
                aria-hidden="true"
                className={classNames(
                    item.enabled ? 'translate-x-5' : 'translate-x-0',
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out'
                )}
            />
        </Switch>
    </div>
);

}
