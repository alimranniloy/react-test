export default function auth({ next, auth }) {
    if (!auth.value) {
        return next({
            name: 'Login'
        })
    }

    return next()
}