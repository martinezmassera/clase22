const fs = require('fs');
const { faker } = require('@faker-js/faker')
class ContenedorFile {

    constructor(archivo) {
        this.archivo = archivo;
        this.datos = []
        this.id = 0
        this.id_prod = 0
        try {
            this.read()
        } catch (error) {
            this.write()
        }
    }

    read() {
        this.datos = JSON.parse(fs.readFileSync(this.archivo));
    }

    write() {
        fs.writeFileSync(this.archivo, JSON.stringify(this.datos));
    }

    count() {
        const lastItem = this.datos[this.datos.length - 1];
        if (this.datos.length < 1) {
            this.id = 1
        } else {
            this.id = lastItem.id + 1
        }
        return this.id
    }

    newProduct() {
        return {
            name: faker.commerce.product(),
            lastname: faker.commerce.productName(),
            website: faker.internet.url(),
            image: faker.image.avatar()
        }
    }

    async populate(cant = 5) {
        const news = []
        for (let i = 0; i < cant; i++) {
            const product = this.newProduct()
            this.add(product)
            news.push(product)
        }

        return news
    }

    async getAll() {
        return this.datos
    }

    async add(datos) {
        const id = this.count()
        datos['id'] = id
        this.datos.push(datos)
        this.write()

        return datos
    }

    async deleteAll() {
        this.datos = []
        this.write()
    }

    async getByID(id) {
        const busqueda = this.datos.filter(dato => dato.id == id)
        return busqueda
    }

    async editById(datos, id) {
        datos['id'] = id
        const busqueda = this.datos.findIndex(dato => dato.id === id)
        this.datos.splice(busqueda, 1, datos)
        this.write()
    }

    async deleteByID(id) {
        const busqueda = this.datos.findIndex(dato => dato.id == id)
        this.datos.splice(busqueda, 1)
        this.write()
    }

    async addToCart(idCart, product) {
        const cart = this.datos.find(dato => dato.id == idCart)
        if (cart.products.length < 1) {
            this.id_prod = 1
        } else {
            this.id_prod++
        }
        product['id'] = this.id_prod
        console.log(cart.products.length)
        cart.products.push(product)
        this.write()
    }

    async deleteProdInCart(idCart, idProd) {
        const buscaCart = this.datos.find(dato => dato.id == idCart)
        const prodIndex = buscaCart.products.findIndex(dato => dato.id == idProd)
        buscaCart.products.splice(prodIndex, 1)
        this.write()
        return
    }


}

module.exports = ContenedorFile;