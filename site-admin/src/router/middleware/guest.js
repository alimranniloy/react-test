export default function guest ({ next, auth }){
    if(auth.value){
        return next({
           name: 'Home'
        })
    }
   
    return next()
   }