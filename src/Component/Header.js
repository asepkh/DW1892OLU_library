import React from 'react';
import icon from '../Assets/icon.png';

export default function Header(){
    return (
        <header className="App-header">
        <p><img src={icon} alt="icon" /> Lib'rary</p>
        </header>
    );
}
