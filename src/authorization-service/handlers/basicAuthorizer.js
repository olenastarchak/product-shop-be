const basicAuthorizer = async (event, ctx, cb) => {
  console.log('function started, event:', event)

  if (event.type !== 'TOKEN') cb('Unauthorized')

  try {
    const { authorizationToken } = event
    const encodedCreds = authorizationToken.split(' ')[1]
    const buff = Buffer.from(encodedCreds, 'base64')
    const [ username, password ] = buff.toString('utf-8').split(':')
    console.log(`username:${username} password:${password}`)

    const storedPass = process.env[username]
    const effect = storedPass && storedPass === password ? 'Allow' : 'Deny'

    const policy = generatePolicy(encodedCreds, event.methodArn, effect)
    cb(null, policy)

  } catch (error) {
    console.log(error)
    cb(`Unauthorized`)
  }
}

const generatePolicy = (principalId, resource, effect = 'Deny') => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

module.exports = basicAuthorizer;
