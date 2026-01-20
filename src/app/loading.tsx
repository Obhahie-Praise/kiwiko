import { LoaderCircle } from 'lucide-react'

const loading = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <LoaderCircle width={60} height={60} className='animate-spin' />
    </div>
  )
}

export default loading