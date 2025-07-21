import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import ErrorMessage from '../components/ErrorMessage'
import { LoginForm } from '../types'
import api from '../config/axios'

export default function LoginView() {
  const navigate = useNavigate()
  const initialValues: LoginForm = {
    email: '',
    password: ''
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const handleLogin = async (formData: LoginForm) => {
    try {
      const { data } = await api.post(`/auth/login`, formData)
      localStorage.setItem('AUTH_TOKEN', data)
      navigate('/admin')
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error)
      }
    }
  }

  return (
    <>
      <h1 className='text-4xl text-white font-bold'>Iniciar Sesión</h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
        noValidate
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-600">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-200 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-600">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="bg-slate-200 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
            type="submit"
            value="Iniciar Sesión"
            className="bg-lime-500 hover:bg-lime-600 active:scale-95 hover:shadow-lg text-white p-3 w-full text-lg uppercase font-bold rounded-lg cursor-pointer transition-all duration-300 ease-in-out"
                />
      </form>


      <nav className='mt-10'>
        <Link
          className='text-center text-white text-lg block'
          to="/auth/register"
        >¿No tienes cuenta? Crea una aquí</Link>
      </nav>
    </>
  )
}
