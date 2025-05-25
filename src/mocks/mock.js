import apiClient from "../services/axios.js"
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(apiClient)

export default mock
