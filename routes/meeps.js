var express = require('express');
var router = express.Router();
const pool = require('../database');


router.get('/', async (req, res, next) => {

    await pool.promise()
        .query('SELECT * FROM iscdan_meeps ORDER BY created_at DESC')
        .then(([rows, fields]) => {
            console.log(rows);
            res.render('meeps.njk', {
                meeps: rows,
                title: 'meeps',
                layout: 'layout.njk'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: 'Error getting meeps'
                }
            })
        });
});

router.post('/', async (req, res, next) => {
    const meep = req.body.meep;

    await pool.promise()
        .query('INSERT INTO iscdan_meeps (body) VALUES (?)', [meep])
        .then((response) => {
            console.log(response[0].affectedRows);
            if (response[0].affectedRows === 1) {
                res.redirect('/meeps');
            } else {
                res.status(400).json({
                    meeps: {
                        error: 'Invalid meep'
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: 'Error posting meep'
                }
            })
        });
}
    // res.json(req.body);

);
router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
        .query('DELETE FROM iscdan_meeps WHERE id = ?', [id])
        .then((response) => {
            if (response[0].affectedRows === 1) {
                res.redirect('/meeps');

            } else {
                res.status(400).redirect('/meeps');
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: 'Error deleting meep'
                }
            })
        });
});



// router.get('/:id', async (req, res, next) => {
//     const id = req.params.id;
//     await pool.promise()
//         .query('SELECT * FROM iscdan_meeps WHERE id = ?', [id])
//         .then(([rows, fields]) => {
//             console.log(rows);
//             res.render('edit.njk', {
//                 meeps: rows,
//                 title: 'meeps',
//                 layout: 'layout.njk'
//             });
            

           
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 meeps: {
//                     error: 'Error getting meep'
//                 }
//             })
//         });
//     });


//     router.post('/:id/', async (req, res, next) => {
//         const meep = req.body.meep;
//         const id = req.params.id;
        
//         await pool.promise()
//             .query('UPDATE iscdan_meeps SET body = ? WHERE id = ?', [meep, id])
//             .then((response) => {
//                 console.log(response[0].affectedRows    );
//                 if (response[0].affectedRows === 1) {
//                     res.redirect('/meeps');
//                 } else {
//                     res.status(400).redirect('/meeps');
//                 }
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.status(500).json({
//                     task: {
//                         error: 'Error posting meep'
//                     }
//                 })
//             });
//     }
//         // res.json(req.body);
    
//     );


    router.get('/api', async (req, res, next) => {
        await pool.promise()
            .query('SELECT * FROM iscdan_meeps')
            .then(([rows, fields]) => {
                res.json({
                    meeps: rows,
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    tasks: {
                        error: 'Error getting tasks'
                    }
                })
            });
    });





module.exports = router