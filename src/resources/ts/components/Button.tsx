import React from 'react';
import { Button } from '@mui/material';

export default function Button_Main(props:any) {
  return(
    <>
    <Button 
    variant={props.shape} 
    color={props.color}
    onClick={props.onClick}
    disabled={props.disabled}
    >
      {props.content}
    </Button>
    </>
  )
}