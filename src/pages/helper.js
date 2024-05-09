import { getDoc } from 'firebase/firestore'
import { get, set } from 'lodash'

const getReference = async documentReference => {
  const res = await getDoc(documentReference)
  const data = res.data()

  if (data && documentReference.id) {
    data.uid = documentReference.id
  }

  return data
}

// Esta función recibe un documento y hidrata los atributos que contienen 
// documentReference que le pases dentro de paths
const hydrate = async (document, newDoc={}, paths = []) => Promise.all(
 
  paths.map(async path => {
    const documentReference = get(document, path)

    if (!documentReference || !documentReference.path) {
      return console.warn(
        `Error hydrating documentReference for path "${path}": Not found or invalid reference`
      )
    }

    const result = await getReference(documentReference);
    set(newDoc, path, result)
  }).flat()
)

export { hydrate }