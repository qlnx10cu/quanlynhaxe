import React from 'react';
import Input from './Input';
import styled from 'styled-components';

const Name = styled.div `
    position: absolute;
    display: ${props => props.hidden ? 'none' : 'block'};
    top: -7px;
`
const Message = styled.div `
    position: absolute;
    display: ${props => props.hidden ? 'none' : 'block'};
    top: 65px;
    color: #c0392b;
    font-size: 13px;
    text-align: right;
    width: 100%;
`

export default ({name, message, error, ...res}) => {
    let hidden = !res.value;
    return (
        <div style={{width: '90%', position: 'relative'}}>
            <Name hidden={hidden}>{name}</Name>
            <Input {...res} style={{borderColor: error ? '#c0392b' : ''}}/>
            <Message hidden={!error}>{message}</Message>
        </div>
    )
}