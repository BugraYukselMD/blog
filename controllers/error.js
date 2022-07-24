module.exports.get404Page = (req, res) => {
    res.status(404).render('errors/404', { title: 'Sayfa Bulunamadı!' });
}

module.exports.get500Page = (req, res) => {
    res.status(500).render('errors/500', { title: 'Hata!' });
} 