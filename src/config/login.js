import { TextField } from '@mui/material';

export const loginFormControls = [
    
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter Email',
        componentType: TextField,
        type: 'email',
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter Password',
        componentType: TextField,
        type: 'password',
    },
    
];