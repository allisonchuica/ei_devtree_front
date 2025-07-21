import { Link, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import NavigationTabs from "./NavigationTabs"
import { SocialNetwork, User } from '../types'
import { useEffect, useState } from 'react'
import DevTreeLink from './DevTreeLink'
import { useQueryClient } from '@tanstack/react-query'
import HeaderAdmin from './HeaderAdmin'


type DevTreeProps = {
    data: User
}

export default function DevTree({ data }: DevTreeProps) {

    const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))

    useEffect(() => {
        setEnabledLinks(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    }, [data])

    const queryClient = useQueryClient()
    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e

        if (over && over.id) {
            const prevIndex = enabledLinks.findIndex(link => link.id === active.id)
            const newIndex = enabledLinks.findIndex(link => link.id === over.id)
            const order = arrayMove(enabledLinks, prevIndex, newIndex)
            setEnabledLinks(order)

            const disabledLinks: SocialNetwork[] = JSON.parse(data.links).filter((item: SocialNetwork) => !item.enabled)
            const links = order.concat(disabledLinks)
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData,
                    links: JSON.stringify(links)
                }
            })

        }
    }

    return (
        <>
            <HeaderAdmin/>
    <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-screen py-10">
    <main className="mx-auto max-w-5xl p-10 md:p-0">
        <NavigationTabs />
    <div className="flex justify-end pr-10">
    <Link
        to={`/${data.handle}`}
        target="_blank"
        rel="noreferrer noopener"
        className="relative group inline-flex items-center px-6 py-2 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
    >
        <span className="group-hover:underline underline-offset-4 transition-all duration-300">
        Visitar Mi Perfil: /{data.handle}
        </span>
        <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
    </Link>
    </div>


        <div className="flex flex-col md:flex-row gap-10 mt-10">
        <div className="flex-1">
            <Outlet />
        </div>

        <div className="w-full md:w-96 bg-slate-600 px-6 py-10 space-y-6 rounded-xl shadow-lg">
            <p className="text-4xl text-center text-white font-bold tracking-wide">{data.handle}</p>

            {data.image && (
            <img
                src={data.image}
                alt="Imagen Perfil"
                className="mx-auto rounded-full border-4 border-white shadow-md w-44 h-44 object-cover"
            />
            )}

            <p className="text-center text-lg font-semibold text-white opacity-80 italic">
            {data.description}
            </p>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="mt-10 flex flex-col gap-5">
                <SortableContext items={enabledLinks} strategy={verticalListSortingStrategy}>
                {enabledLinks.map((link) => (
                    <DevTreeLink key={link.name} link={link} handle={data.handle} />
                ))}
                </SortableContext>
            </div>
            </DndContext>
        </div>
        </div>
    </main>
    </div>
                <Toaster position="top-right" />
            </>
        )
    }
