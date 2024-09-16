import * as THREE from 'three'
export class StreetLight {

  static async prepare(objLoader: any) {
  //  // load meshes
  //  const materials = await mtlLoader.loadAsync('models/streetlight/streetlight.mtl')
  //  materials.preload()

  //  objLoader.setMaterials(materials)
  //  const streetLightObj = await objLoader.loadAsync('models/streetlight/streetlight.obj')
  }
  async init() {
 
    const lights: THREE.PointLight[] = []
  }
  
  async draw() {

  }
}