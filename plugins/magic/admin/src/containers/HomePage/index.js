/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect, memo } from 'react';
import pluginId from '../../pluginId';
import {
  request
} from 'strapi-helper-plugin'
import {Container, Block } from '../../components/StrapiStyled'
import {InputText, Button, Padded} from '@buffetjs/core'

const HomePage = () => {

  const [sk, setSk] = useState('')

  useEffect(() => {
    try{
      const loadSk = async () => {
        const response = await request(`/${pluginId}/settings`, {
          method: 'GET'
        })

        const {sk} = response
        setSk(sk)
      }
      loadSk()
    } catch (err) {
      strapi.notification.error(err.toString())
    }
  }, [])

  const updatedSk = async (e) => {
    try{
      e.preventDefault()
      strapi.lockApp()
      const response = await request(`/${pluginId}/settings`, {
        method: 'POST',
        body: {sk}
      })
      strapi.notification.success('Success')
    } catch(err){
      strapi.notification.error(err.response && err.response.payload.message || err.toString())
    }
    strapi.unlockApp()
  }

  return (
    <div className="row">
      <div className="col-md-12">
      <Container>
        <Block>
          <h1>Magic</h1>
          <p>Save your secret key here</p>
          <p>Users can still log in via Strapi, unless you block registration and / or the endpoints</p>

          <form onSubmit={updatedSk}>
            <InputText 
              value={sk}
              onChange={(e) => setSk(e.target.value)}
              name="input"
              type="password"
              placeholder="Magic Secret Key"
            />
            
            <Padded
              top
            >
              <Button color="primary" label="Submit" type="submit" />
            </Padded>
            
          </form>

        </Block>
      </Container>
      </div>
    </div>
  );
};

export default memo(HomePage);