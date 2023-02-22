import React from 'react'
import ModuleGrid from '../../components/ModuleGrid';
import Listagem from './Listagem';

function TodoList() {
  return (
    <ModuleGrid title='Lista de Tarefas' component={<Listagem />} />
  )
}

export default TodoList;