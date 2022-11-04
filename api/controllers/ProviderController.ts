import { Op } from 'sequelize';
import  nodemailer  from 'nodemailer';
import  md5  from 'md5';
import { Request, Response, NextFunction } from 'express';

import BaseController from './BaseController';

import ProviderModel from '../models/Provider';

class ProviderController extends BaseController {

  index = async (req: Request, res: Response) => {
    let result = await this.montaWhere(req);

    const users = await ProviderModel.findAll({
      where: result.where,
      limit: result.limit,
      offset: result.offset,
      order: [[result.sort, result.order]]
    });
    res.json(users);
  }

  montaWhere = async (req: Request) => {
    const params = req.query;
    const limit: number = parseInt(params.limit as string) || 100;
    const page: number = parseInt(params.page as string) || 1;
    const offset: number = (page - 1) * limit;
    const sort: any = params.sort || 'id';
    const order: any = params.order || 'ASC';
    const where: any = {};

    if (params.name) {
      where.name =
      {
        [Op.iLike]: `%${params.name}%`
      };
    }

    if (params.email) {
      where.email =
      {
        [Op.iLike]: `%${params.email}%`
      };
    }

    if (params.min_age) {
      where.age =
      {
        [Op.gte]: params.min_age
      };
    }

    if (params.max_age) {
      if (!where.age) {
        where.age = {};
      }

      where.age[Op.lte] = params.max_age;
    }

    if (params.sex) {
      where.sex = params.sex;
    }

    const result = {
      where: where,
      offset: offset,
      limit: limit,
      sort: sort,
      order: order
    }

    return result;
  }

  pdf = async (req: Request, res: Response, next: NextFunction) => {
    //let where = await this.montaWhere(req);
    const users = await ProviderModel.findAll();
    let tBody: string = '';

    for (let i in users) {
      let user = users[i];
      tBody += `<tr>
      <td>${user.name}</td>
      <td>${user.age}</td>
      <td>${user.sex}</td>
      <td>${user.email}</td>
      </tr>`;
    }

    const html = `<h1>Lista de usuários</h1>
    <table style="width:100%" border="1">
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Sex</th>
        <th>Email</th>
      </tr>
      ${tBody}
    </table>
    `;


    await this.generatePdf(html, req, res);
  }

  csv = async (req: Request, res: Response, next: NextFunction) => {
    const users = await ProviderModel.findAll();
    let csv: string = `name;age;sex;email`;

    for (let i in users) {
      let user = users[i];
      csv += `
      ${user.name};${user.age};${user.sex};${user.email}`;
    }

    res.header("Content-type", "text/csv");
    res.header("Content-Disposition", "attachment; filename=usuarios.csv");
    res.header("Pragma", "attachment; no-cache");
    res.header("Expires", "0");

    res.send(csv);
  }


  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body.password = md5(req.body.password)
      this._main(req.body.email);
      const data = await this._validateData(req.body);
      const user = await ProviderModel.create(data);
      res.json(user);
    }
    catch (error: any) {
      res.status(400).json({ error: error.message + "" });
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    const user = await ProviderModel.findByPk(req.params.providerId);
    res.json(user);
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.providerId;
      const data = await this._validateData(req.body, id);
      await ProviderModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await ProviderModel.findByPk(id));
    }
    catch (error: any) {
      res.status(400).json({ error: error.message + "" });
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    await ProviderModel.destroy({
      where: {
        id: req.params.providerId
      }
    });
    res.json({});
  }

  authentication = async (req: Request, res: Response) => {
    let authorization = req.headers.authorization as string;
    authorization = authorization.replace("Basic ", '');
    let ascii = Buffer.from(authorization, 'base64').toString('ascii')
    let data = ascii.split(":");

    // let username = data[0];
    // let password = data[1];

    // let logged = await ProviderModel.locateUser(username, password);
    // res.json(logged);
  }

  _validateData = async (data: any, id?: any) => {
    const attributes = ['name', 'age', 'sex', 'email', 'password'];
    const user: any = {};

    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }

      user[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(user.email, id)) {
      throw new Error(`The user with mail address "${user.email}" already exists.`);
    }

    return user;
  }

  _checkIfEmailExists = async (email: string, id?: string) => {
    const where: any =
    {
      email: email
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await ProviderModel.count({
      where: where
    });

    return count > 0;
  }


  _main = async (email: any) => {

    let email_user = 'tcharles.lassen@universo.univates.br';
    let email_pass = "TcharlesDavi1896";
    let email_to = await email;
    console.log(email_to);
    let email_subject = "Bem vindo ao COFFEHOUSE seu melhor café está aqui";
    let email_content = "Aproveite todos os sabores ";
    let email_html ='<h1>Faalaaa Dev quer seu café ?!</h1><p>Muito bom ter voçê por aqui </P>';
     // <img src="cid:igne_lab_rockedseat"/>
      // attachments: [{
      //   filename: 'igne_lab_rockedseat.png',
      //   path: __dirname+'/igne_lab_rockedseat.png',
      //   cid: 'igne_lab_rockedseat.png' //same cid value as in the html img src
      // }],

    var transponder = nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: email_user,
          pass: email_pass
        }
      }
    )

    var mailOptions = {
      from: email_user,
      to: await email,
      subject: email_subject,
      text: email_content,
      html: email_html,
    };

    transponder.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erro ao enviar o email " + error)
      }
      else {
        console.log("Email enviado " + info.response)
      }
    })
  }

}

export default new ProviderController();