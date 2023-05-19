import { Response } from 'express'

export const setCookie = (res: Response, token: string) => {
  return (
    res.cookie('refresh', token, {
      httpOnly: true,
      path: '/api/auth',
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    })
  )
}

export const deleteCookie = (res: Response) => res.clearCookie('refresh', { path: '/api/auth' })

export const parseCookie = (cookies: string[], name: string) => {
  const cookieData = cookies.find(item => item.includes(name)).split(';')

  return cookieData.find(item => item.includes(name)).replace(`${name}=`, '')
}
