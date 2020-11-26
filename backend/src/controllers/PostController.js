const Post = require('../models/Post');

module.exports = {
  async index(request, response) {
    const posts = await Post.find();

    return response.json(posts);
  },

  async create(request, response) {
    const { originalname: name, size, key, location: url = '' } = request.file;

    const post = await Post.create({
      name,
      size,
      key,
      url,
    })

    return response.json(post);
  },

  async delete(request, response) {
    const { id } = request.params;

    const post = await Post.findById(id);

    if (!post) {
      return response.status(204).send();   //Retorna sucesso quando não há nada para ser deletadp
    }

    await post.remove();

    return response.status(204).send();
  }
}