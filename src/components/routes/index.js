import { createRouter, createWebHashHistory } from 'vue-router';
import Dictionaries from '../Dictionaries.vue';
import MainPage from '../MainPage.vue';
import AddDictionary from '../AddDictionary.vue';
import AddEditDictionary from '../AddEditDictionary.vue';
import EditDictionary from '../EditDictionary.vue';
import AddNewWord from '../AddNewWord.vue';
import EditWords from '../EditWords.vue';
const routes = [
  { path: '/', component: MainPage, name: 'main' },
  { path: '/dict', component: Dictionaries, name: 'dictionaries' },
  { path: '/create-dict', component: AddDictionary, name: 'addNewDictionary' },
  { path: '/add-edit-dictionary/:dictName', component: AddEditDictionary, name: 'addEditDictionary' },
  { path: '/edit-dictionary/:dictName', component: EditDictionary, name: 'editDictionary' },
  { path: '/add-new-word/:dictName', component: AddNewWord, name: 'addNewWord' },
  { path: '/edit-word/:dictName/:word/:translation', component: EditWords, name: 'editWords' },
];

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
export default router;