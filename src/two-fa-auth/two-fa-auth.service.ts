import { Injectable } from '@nestjs/common'
import * as speakeasy from 'speakeasy'

@Injectable()
export default class TwoFaAuthService {
  generate() {
    return speakeasy.generateSecret()
  }

  generateQRUrl(secret: string) {
    return speakeasy.otpauthURL({ secret, label: 'Label', issuer: 'Issuer', encoding: 'base32' })
  }

  verify(token: string, secret: string) {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token  })
  }
}
