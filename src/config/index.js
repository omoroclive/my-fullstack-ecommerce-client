import { TextField } from '@mui/material';

export const registerFormControls = [
    {
        name: 'firstName',
        label: 'First Name',
        placeholder: 'Enter First Name',
        componentType: TextField,
        type: 'text',
    },
    {
        name: 'lastName',
        label: 'Last Name',
        placeholder: 'Enter Last Name',
        componentType: TextField,
        type: 'text',
    },
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