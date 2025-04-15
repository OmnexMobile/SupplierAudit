import React, { Component } from 'react'
import { Image } from 'react-native'
import Images from '../Themes/Images'

export default function AuditBackground(props) {

    return (
      <Image
        source={Images.LoginBack}
        style={{
          resizeMode:'stretch',
          width: '100%',
          height: '100%'
        }}
      />
    )
}
