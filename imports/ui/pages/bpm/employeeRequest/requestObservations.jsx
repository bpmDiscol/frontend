import React from 'react'
import BPMEditor from '../../../components/editor'

export default function RequestObservations({ requestData, update }) {
  return (
    <div><BPMEditor requestData={requestData} update={update} /></div>
  )
}
