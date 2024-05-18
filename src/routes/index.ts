import { Router } from 'express'
import { readdirSync } from 'fs'

const PATH_ROUTER = `${__dirname}`
const router = Router()

/**Limpiar el nombre de la carpeta routes */
const cleanFileName = (fileName: string): string =>  fileName.split('.').shift() ?? ''

/**Leer /routes y usar cada una de las rutas */
readdirSync(PATH_ROUTER).filter( (fileName) => {
  const cleanName = cleanFileName(fileName)

  if(cleanName !== 'index' && cleanName.length > 0){
    import(`./${fileName}`).then( (moduleRoute)=> {
      console.log(`cargando la ruta ${cleanName}`)
      router.use( `/${cleanName}`, moduleRoute.router)
    })
  }
})

export default router