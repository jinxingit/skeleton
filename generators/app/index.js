'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');

var dot = '.';
var spl = '/';
var land = '-';
var module_app = 'app';
// var module_common_dal = 'common.dal';
// var module_common_service_referer = 'common.service.referer';
// var module_common_service_exporter = 'common.service.exporter';
// var module_core_model = 'core.model';
// var module_core_service = 'core.service';

var modules = [module_app];

var main_java_maven = 'src/main/java';
var res_java_maven = 'src/main/resources';
var test_java_maven = 'src/test/java';
var test_res_maven = 'src/test/resources';

var mavens = [main_java_maven,res_java_maven,test_java_maven,test_res_maven];


var GogenGenerator = module.exports = function GogenGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
};

util.inherits(GogenGenerator, yeoman.generators.Base);

GogenGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    console.log(chalk.green(
                `    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n` +
                `    | CHJ springboot Project Generator  |\n` +
                `    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n` +
        chalk.yellow('\n你可以根据本向导构建出一个基本的Spring Boot项目\n\n更多的自定义需求可以进行添加，此版本只为了演示\n\n')));

    var prompts = [
        {
            type: 'string',
            name: 'projectName',
            message: '输入project name (chehejia-service-vehiclebiz形式,创建在当前目录下):',
            default: 'untitled'
        }, {
            type: 'string',
            name: 'packageName',
            message: '输入package name (com.chehejia.order形式):',
            default: 'com.chehejia.order'
        },{
            type: 'string',
            name: 'proVersion',
            message: '输入项目版本 (x.y.z-SNAPSHOT形式):',
            default: '0.0.1-SNAPSHOT'
        }, {
            type: 'checkbox',
            name: 'optionalItem',
            message: '请勾选可选项 (支持多选):',
            choices: [
                {
                    name: 'eureka支持',
                    value: 'eureka'
                }, {
                    name: 'mysql支持',
                    value: 'mysql'
                }, {
                    name: 'config-server支持',
                    value: 'config'
                }, {
                    name: 'thymeleaf支持',
                    value: 'thymeleaf'
                }, {
                    name: 'dubbo支持',
                    value: 'dubbo'
                }
            ]
        }, {
            type: 'string',
            name: 'chehejiaParentVersion',
            message: '可选自定义com.chehejia.mall版本:',
            default: '0.0.1-SNAPSHOT'
        }, {
            type: 'string',
            name: 'commonUtilsVersion',
            message: '可选自定义common-utils版本:',
            default: '0.0.1-SNAPSHOT'
        }, {
            type: 'string',
            name: 'mysqlConn',
            message: '可选初始化mysql连接 (ip:port:user:pwd:database):',
            default: '127.0.0.1:3306:root:123456:order'
        }, {
            type: 'confirm',
            name: 'needSwagger',
            message: '是否需要自动生成接口文档?',
            default: true
        }, {
            type: 'confirm',
            name: 'supportDocker',
            message: '是否需要支持打包成Docker镜像?',
            default: true
        }, {
            type: 'confirm',
            name: 'needReadme',
            message: '是否需要在README中加入新手文档?',
            default: true
        }
    ];

    this.prompt(prompts, function(props) {

        this.projectName = props.projectName.toLowerCase();
        this.packageName = props.packageName;
        this.proVersion = props.proVersion;
        this.optionalItem = props.optionalItem;
        this.supportDocker = props.supportDocker;
        this.needReadme = props.needReadme;
        this.needSwagger = props.needSwagger;
        this.chehejiaParentVersion = props.chehejiaParentVersion;
        this.commonUtilsVersion = props.commonUtilsVersion;
        this.needGatling = props.needGatling;
        this.mysqlConn = props.mysqlConn;

        var checkOptional = function(item) {
            return props.optionalItem.indexOf(item) !== -1;
        };
        this.mysql = checkOptional('mysql');
        this.config = checkOptional('config');
        this.thymeleaf = checkOptional('thymeleaf');
        this.dubbo = checkOptional('dubbo');
        this.eureka = checkOptional('eureka');

        this.mysqlHost = this.mysqlConn.split(':')[0];
        this.mysqlPort = this.mysqlConn.split(':')[1];
        this.mysqlUser = this.mysqlConn.split(':')[2];
        this.mysqlPwd = this.mysqlConn.split(':')[3];
        this.mysqlDb = this.mysqlConn.split(':')[4];
        //模板值定义
        this.fullApp = this.packageName;
        // this.fullApp = this.packageName+dot+module_app;

        // this.fullCommonUtil = this.packageName+dot+module_common_util;
        // this.fullCommonDal = this.packageName+dot+module_common_dal;
        // this.fullCommonServiceExporter = this.packageName+dot+module_common_service_exporter;
        // this.fullCommonServiceReferer = this.packageName+dot+module_common_service_referer;
        // this.fullCoreModel = this.packageName+dot+module_core_model;
        // this.fullCoreSrvice = this.packageName+dot+module_core_service;

        this.artApp = pac2land(this.projectName,module_app);
        this.artApp = pac2land(this.projectName,module_app);
        // this.artCommonUtil = pac2land(this.projectName,module_common_util);
        // this.artCommonDal =pac2land(this.projectName,module_common_dal) ;
        // this.artCommonServiceExporter = pac2land(this.projectName,module_common_service_exporter);
        // this.artCommonServiceReferer = pac2land(this.projectName,module_common_service_referer);
        // this.artCoreModel = pac2land(this.projectName,module_core_model);
        // this.artCoreSrvice = pac2land(this.projectName,module_core_service);

        cb();
    }.bind(this));
};

GogenGenerator.prototype.app = function app() {

    for (var i=0; i<modules.length; i++) {
        var w = pac2path(modules[i]);
        var x = this.projectName+ spl + w;
        for (var j=0; j<mavens.length; j++) {
            //创建所有maven目录
            mkdirp(x+ spl + mavens[j]);
        }
        //创建src with package目录
        mkdirp(x+ spl + main_java_maven+spl+pac2path(this.packageName+'.'+modules[i]));
        //module pom填充
        this.template(w + spl + 'pom.xml',x + spl + 'pom.xml');
    }

    // 根目录填充
    this.template('pom.xml',this.projectName+ spl +'pom.xml');
    // this.template('editorconfig',this.projectName+ spl +'.editorconfig');
    // this.template('gitattributes',this.projectName+ spl +'.gitattributes');
    this.template('gitignore',this.projectName+ spl +'.gitignore');
    this.template('gitlab-ci.yml',this.projectName+ spl +'.gitlab-ci.yml');

    if(this.needReadme){
        this.template('README-with-tour.md',this.projectName+ spl +'README.md');
    }else{
        this.template('README-simple.md',this.projectName+ spl +'README.md');
    }

    //app module填充
    if(this.supportDocker){
        var template_module_app_docker = module_app + '/docker';
        var project_module_app_docker = this.projectName + spl + template_module_app_docker;
        mkdirp(project_module_app_docker);
        //docker文件填充
        this.template(template_module_app_docker + '/Dockerfile',project_module_app_docker + '/Dockerfile');
    }

    if(this.dubbo){
        this.template(module_app+spl+res_java_maven+spl+'application.properties',this.projectName+spl+module_app+spl+res_java_maven+spl+'application.properties');
        this.template(module_app+spl+main_java_maven+spl+'service/HelloService.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'service/HelloService.java');
        this.template(module_app+spl+main_java_maven+spl+'service/HelloServiceImpl.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'service/HelloServiceImpl.java');
    }

    //thymeleaf填充
    if(this.thymeleaf){
        mkdirp(this.projectName + spl+module_app+spl+res_java_maven+spl+'templates');
    }

    //代码填充
    this.template(module_app+spl+main_java_maven+spl+'RootApplication.java',this.projectName+spl+module_app+spl+main_java_maven+spl+'com/chehejia'+spl+'RootApplication.java');

    this.template(module_app+spl+main_java_maven+spl+'config/AopConfiguration.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'config/AopConfiguration.java');
    if(this.needSwagger){
        this.template(module_app+spl+main_java_maven+spl+'config/SwaggerConfiguration.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'config/SwaggerConfiguration.java');
    }

    this.template(module_app+spl+main_java_maven+spl+'controller/advice/FaultBarrier.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'controller/advice/FaultBarrier.java');
    this.template(module_app+spl+main_java_maven+spl+'controller/client/AccountClient.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'controller/client/AccountClient.java');
    this.template(module_app+spl+main_java_maven+spl+'controller/client/AccountClientFallback.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'controller/client/AccountClientFallback.java');

    this.template(module_app+spl+main_java_maven+spl+'controller/OrderController.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'controller/OrderController.java');
    this.template(module_app+spl+main_java_maven+spl+'controller/OrderStatusGenerator.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'controller/OrderStatusGenerator.java');
    this.template(module_app+spl+main_java_maven+spl+'controller/StatusCode.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'controller/StatusCode.java');

    this.template(module_app+spl+main_java_maven+spl+'domain/type/handler/OrderStatusHandler.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'domain/type/handler/OrderStatusHandler.java');
    this.template(module_app+spl+main_java_maven+spl+'domain/Order.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'domain/Order.java');
    this.template(module_app+spl+main_java_maven+spl+'domain/type/OrderStatus.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'domain/type/OrderStatus.java');

    this.template(module_app+spl+main_java_maven+spl+'model/request/PlaceOrderRequest.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'model/request/PlaceOrderRequest.java');
    this.template(module_app+spl+main_java_maven+spl+'model/response/ObjectDataResponse.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'model/response/ObjectDataResponse.java');

    this.template(module_app+spl+main_java_maven+spl+'persistence/OrderMapper.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'persistence/OrderMapper.java');
    this.template(module_app+spl+main_java_maven+spl+'service/OrderService.java',this.projectName+spl+module_app+spl+main_java_maven+spl+pac2path(this.fullApp)+spl+'service/OrderService.java');

    //resources填充
    this.template(module_app+spl+res_java_maven+spl+'db/migration/V1_0_1__DDL_INIT.sql',this.projectName+spl+module_app+spl+res_java_maven+spl+'db/migration/V1_0_1__DDL_INIT.sql');
    this.template(module_app+spl+res_java_maven+spl+'db/migration/V1_0_2__EDA_DDL_INIT.sql',this.projectName+spl+module_app+spl+res_java_maven+spl+'db/migration/V1_0_2__EDA_DDL_INIT.sql');

    this.template(module_app+spl+res_java_maven+spl+'mapper/OrderMapper.xml',this.projectName+spl+module_app+spl+res_java_maven+spl+'mapper/OrderMapper.xml');

    this.template(module_app+spl+res_java_maven+spl+'banner.txt',this.projectName+spl+module_app+spl+res_java_maven+spl+'banner.txt');
    this.template(module_app+spl+res_java_maven+spl+'logback-spring.xml',this.projectName+spl+module_app+spl+res_java_maven+spl+'logback-spring.xml');
    this.template(module_app+spl+res_java_maven+spl+'generatorConfig.xml',this.projectName+spl+module_app+spl+res_java_maven+spl+'generatorConfig.xml');
    this.template(module_app+spl+res_java_maven+spl+'bootstrap.yml',this.projectName+spl+module_app+spl+res_java_maven+spl+'bootstrap.yml');

};

function pac2path(tt){
    return tt.replace(/\./g, spl);
}

function pac2land(ss,tt){
    return ss+land+tt.replace(/\./g, land);
}

GogenGenerator.prototype.projectfiles = function projectfiles() {};

