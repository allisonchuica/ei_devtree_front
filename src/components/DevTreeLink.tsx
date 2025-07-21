import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SocialNetwork } from "../types"
import { useState, useEffect } from 'react'

type DevTreeLinkProps = {
  link: SocialNetwork
  handle: string
}

export default function DevTreeLink({ link, handle }: DevTreeLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: link.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const [visitas, setVisitas] = useState<number | null>(null)

  // Cargar visitas al montar el componente
  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const token = localStorage.getItem("AUTH_TOKEN")
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${handle}/visitas`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })

        if (!res.ok) throw new Error('Error al obtener visitas')
        const data = await res.json()
        setVisitas(data.visitas)
      } catch (error) {
        console.error("Error al obtener visitas:", error)
      }
    }

    fetchVisitas()
  }, [handle])

  const handleClick = async () => {
    try {
      const token = localStorage.getItem("AUTH_TOKEN")

      const res = await fetch(`${import.meta.env.VITE_API_URL}/${handle}/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error: ${res.status} - ${text}`)
      }

      const data = await res.json()
      setVisitas(data.visitas ?? (visitas !== null ? visitas + 1 : 1))
      window.open(link.url, '_blank')
    } catch (error) {
      console.error("Error al registrar visita:", error)
      window.open(link.url, '_blank')
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg cursor-pointer"
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
      ></div>
      <div className='border-l-2 border-lime-500 pl-3 space-y-1'>
        <p className="capitalize">Visita mi: <span className="font-bold">{link.name}</span></p>
        {visitas !== null && (
          <p className="text-sm text-gray-500">Visitas al perfil: {visitas}</p>
        )}
      </div>
    </li>
  )
}
