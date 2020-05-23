module.exports = {
    jwtOpt: {
        secretKey: '38wbNQtEvk',
        token: {
            access: {
                type: 'access',
                expiresIn: '1d'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '2d'
            }
        }
    }

}