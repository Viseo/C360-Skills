/**
 * Created by SJO3662 on 04/07/2017.
 */
import Vue from 'vue'
import MockAdapter from 'axios-mock-adapter'
import config from '@/config/config'
import axios from 'axios'

import WishRequest from '@/components/pages/wishRequest'

require('jasmine-ajax');

var mock;

var Constructor = Vue.extend(WishRequest);
var vmWishRequest;

describe('test wishRequest.vue', function() {
  let Token = "eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJpc0FkbWluIjpmYWxzZSwiaWQiOjEsImVtYWlsIjoibGhvdGVAdmlzZW8uY29tIiwidmVyc2lvbiI6MCwiZGVmYXVsdHBpY3R1cmUiOnRydWV9.eguO54P8MHmWrwSREJu5-vCHkhA2Tj995efuHc4twdw";
  beforeEach(function () {
    mock = new MockAdapter(axios);
    vmWishRequest = new Constructor().$mount();
  });

  afterEach(function () {
    Object.assign(vmWishRequest.$data, vmWishRequest.$options.data());

  });

  it('should the return posistion x',function () {
    var i = 50;
    expect(vmWishRequest.positionX(i)).toEqual(vmWishRequest.posX + i*150);
  });

  it('should send a new wish with success response of server',function () {
    mock.onPost(config.server + "/api/addwish").reply(200);
    var wish = {"label": "HTML"};
    vmWishRequest.sendWish(wish);
  });

  it('should send a new wish with error response of server',function () {
    mock.onPost(config.server + "/api/addwish").reply(500);
    var wish = {"label": "HTML"};
    vmWishRequest.sendWish(wish);
  });

  it('should collect all wishes in database with success response of server',function (done) {
    var wishResponse = [{"label": "HTML"}];
    mock.onGet(config.server + "/api/wishes").reply(200,wishResponse);

    vmWishRequest.getAllWishes();
    setTimeout(function () {
      expect(vmWishRequest.wishes).toEqual(wishResponse);
      expect(vmWishRequest.myViewBox).toEqual('0 0 155 250');
      done();
    })
  });

  it('should valid a wish in database with success response of server',function (done) {
    var wish = {"label": "HTML"};
    mock.onPost(config.server + "/api/removewish").reply(200);

    vmWishRequest.validWish(wish);
    setTimeout(function () {
      done();
    });
  });

  it('should valid a wish in database with error response of server',function (done) {
    var wish = {"label": "HTML"};
    mock.onPost(config.server + "/api/removewish").reply(500);

    vmWishRequest.validWish(wish);
    setTimeout(function () {
      done();
    });
  });

  it('should reject a wish in database with success response of server',function (done) {
    var wish = {"label": "HTML"};
    mock.onPost(config.server + "/api/removewish").reply(200);

    vmWishRequest.rejectWish(wish);
    setTimeout(function () {
      done();
    });
  });

  it('should reject a wish in database with error response of server',function (done) {
    var wish = {"label": "HTML"};
    mock.onPost(config.server + "/api/removewish").reply(500);

    vmWishRequest.rejectWish(wish);
    setTimeout(function () {
      done();
    });
  });


});
