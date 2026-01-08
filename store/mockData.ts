
import { AppState } from '../types';

export const INITIAL_DATA: AppState = {
  artists: [],
  songs: [],
  posts: [],
  lyrics: [],
  settings: {
    name: 'Som do Reino',
    slogan: 'Louvor que edifica gerações.',
    aboutText: 'O Som do Reino é um altar digital dedicado à propagação do evangelho através da música e da palavra. Nossa missão é centralizar o mover profético de Luanda para o mundo.',
    featuredSongId: '',
    contactEmail: 'somdoreinoangola@gmail.com'
  },
  history: [],
  favorites: [],
  userProfile: null
};
