import { createServerClient } from '@/lib/supabase'
import { LoginForm } from '@/components/ui/login-form'
import { Logo } from '@/components/ui/logo'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home(
	{ searchParams }: { searchParams: { message?: string } },
) {
	const storeCookie = cookies()
	const supabase = createServerClient(storeCookie)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (session) {
		redirect('/quotations')
	}

	return (
		<>
			<main className=''>
				<div className='flex flex-col lg:flex-row '>
					<div className='flex min-h-screen flex-1 flex-shrink-0 flex-col justify-center items-center border-r border-primary/50 bg-base-200'>
						<aside className='sm:[384px] flex w-[320px] flex-col '>
							<header className='mb-10 '>
								<h1 className='mb-2 mt-8 text-2xl lg:text-3xl '>
									<span>
										Bienvenido a&nbsp;
									</span>
									<Logo />
								</h1>
								<h2 className='text-sm opacity-45'>
									Adminitra cotizaciónes, clientes y más.
								</h2>
							</header>
							<LoginForm message={searchParams?.message} />
							<footer className='mt-10 text-center text-sm'>
								<a href='#'>Olvidaste tu contraseña?</a>
							</footer>
						</aside>
					</div>
					<article className='flex min-h-screen flex-1 flex-shrink basis-1/4 flex-col items-center justify-center bg-primary text-white '>
						<div className='flex max-w-md px-4 flex-col gap-4'>
							<div className='flex max-w-xl flex-col gap-4 font-mono text-2xl text-pretty'>
								<p>
									Desde que supimos que venías, nuestras vidas tomaron, rumbo,
									un horizonte, una meta, un camino🌈.
								</p>
								<p>
									Ahora esta lleno de amor, paciencia, alegria , optimismo,
									trabajo, compromiso y desvelos 👶 jejeje
								</p>
								<p>Todo nuestros logros son para ti y gracias a ti🙏</p>
								<small className='text-sm italic'>
									Para nuestro hijo Johneyder
								</small>
							</div>
							<div className='flex justify-center mt-4'>
								<img
									className='h-36 w-36 animate-bounce'
									src='/johneyder-yoshi.webp'
									alt='Johneyer mi hijo montando yoshi'
								/>
							</div>
						</div>
					</article>
				</div>
			</main>
		</>
	)
}
