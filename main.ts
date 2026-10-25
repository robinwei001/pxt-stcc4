/**
 * DFRobot Gravity STCC4 CO2 Sensor MakeCode Extension
 * 支持读取 CO2浓度(ppm)、温度(℃)、湿度(%RH)
 * I2C地址：0x64 / 0x65
 */
enum STCC4_ADDR {
    //% block="0x64 (100)"
    ADDR64 = 0x64,
    //% block="0x65 (101)"
    ADDR65 = 0x65
}

//% color="#00AA99" icon="\uf185"
namespace STCC4 {
    let _i2cAddr: number = STCC4_ADDR.ADDR64;
    let buf = pins.createBuffer(6);

    /**
     * 初始化 STCC4 传感器
     * @param addr I2C地址
     */
    //% block="初始化 STCC4 CO2传感器 地址 %addr"
    //% weight=90
    export function initSensor(addr: STCC4_ADDR = STCC4_ADDR.ADDR64): void {
        _i2cAddr = addr;
    }

    /**
     * 获取二氧化碳浓度 ppm
     */
    //% block="STCC4 读取CO2浓度 (ppm)"
    //% weight=80
    export function readCO2(): number {
        if (!readAllData()) return -999;
        return (buf[0] << 8) + buf[1];
    }

    /**
     * 获取温度 ℃
     */
    //% block="STCC4 读取温度 (℃)"
    //% weight=70
    export function readTemp(): number {
        if (!readAllData()) return -999;
        let raw = (buf[2] << 8) + buf[3];
        return raw / 100.0;
    }

    /**
     * 获取相对湿度 %RH
     */
    //% block="STCC4 读取湿度 (%RH)"
    //% weight=60
    export function readHumidity(): number {
        if (!readAllData()) return -999;
        let raw = (buf[4] << 8) + buf[5];
        return raw / 100.0;
    }

    // 底层I2C读取一帧数据：CO2(2B) + Temp(2B) + Hum(2B)
    function readAllData(): boolean {
        try {
            // STCC4 正确命令：0x0300，大端16位
            pins.i2cWriteNumber(_i2cAddr, 0x0300, NumberFormat.UInt16BE, false);
            basic.pause(5);
            buf = pins.i2cReadBuffer(_i2cAddr, 6, false);
            return true;
        } catch {
            return false;
        }
    }
}