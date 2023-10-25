import {
  AssetFaceBoxDto,
  AssetFaceUpdateDto,
  AssetResponseDto,
  AuthUserDto,
  BulkIdResponseDto,
  ImmichReadStream,
  MergePersonDto,
  PeopleResponseDto,
  PeopleUpdateDto,
  PersonResponseDto,
  PersonSearchDto,
  PersonService,
  PersonStatisticsResponseDto,
  PersonUpdateDto,
} from '@app/domain';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ParseMeUUIDPipe } from '../api-v1/validation/parse-me-uuid-pipe';
import { AuthUser, Authenticated } from '../app.guard';
import { UseValidation } from '../app.utils';
import { UUIDParamDto } from './dto/uuid-param.dto';

function asStreamableFile({ stream, type, length }: ImmichReadStream) {
  return new StreamableFile(stream, { type, length });
}

@ApiTags('Person')
@Controller('person')
@Authenticated()
@UseValidation()
export class PersonController {
  constructor(private service: PersonService) {}

  @Put(':id/reassign')
  reassignFaces(
    @AuthUser() authUser: AuthUserDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: AssetFaceUpdateDto,
  ): Promise<PersonResponseDto[]> {
    return this.service.reassignFaces(authUser, id, dto);
  }

  @Delete('')
  unassignFaces(
    @AuthUser() authUser: AuthUserDto,
    @Body() dto: AssetFaceUpdateDto,
  ): Promise<BulkIdResponseDto[]> {
    return this.service.unassignFaces(authUser, dto);
  }

  @Get(':id/:assetId/faceasset')
  getAssetFace(
    @AuthUser() authUser: AuthUserDto,
    @Param() { id }: UUIDParamDto,
    @Param('assetId', new ParseMeUUIDPipe({ version: '4' })) assetId: string,
  ): Promise<AssetFaceBoxDto> {
    return this.service.getFaceEntity(authUser, id, assetId);
  }

  @Post('')
  createPerson(@AuthUser() authUser: AuthUserDto, @Body() dto: AssetFaceUpdateDto): Promise<PersonResponseDto> {
    return this.service.createPerson(authUser, dto);
  }

  @Get()
  getAllPeople(@AuthUser() authUser: AuthUserDto, @Query() withHidden: PersonSearchDto): Promise<PeopleResponseDto> {
    return this.service.getAll(authUser, withHidden);
  }

  @Put()
  updatePeople(@AuthUser() authUser: AuthUserDto, @Body() dto: PeopleUpdateDto): Promise<BulkIdResponseDto[]> {
    return this.service.updatePeople(authUser, dto);
  }

  @Get(':id')
  getPerson(@AuthUser() authUser: AuthUserDto, @Param() { id }: UUIDParamDto): Promise<PersonResponseDto> {
    return this.service.getById(authUser, id);
  }

  @Put(':id')
  updatePerson(
    @AuthUser() authUser: AuthUserDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: PersonUpdateDto,
  ): Promise<PersonResponseDto> {
    return this.service.update(authUser, id, dto);
  }

  @Get(':id/statistics')
  getPersonStatistics(
    @AuthUser() authUser: AuthUserDto,
    @Param() { id }: UUIDParamDto,
  ): Promise<PersonStatisticsResponseDto> {
    return this.service.getStatistics(authUser, id);
  }

  @Get(':id/thumbnail')
  @ApiOkResponse({
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
    },
  })
  getPersonThumbnail(@AuthUser() authUser: AuthUserDto, @Param() { id }: UUIDParamDto) {
    return this.service.getThumbnail(authUser, id).then(asStreamableFile);
  }

  @Get(':id/assets')
  getPersonAssets(@AuthUser() authUser: AuthUserDto, @Param() { id }: UUIDParamDto): Promise<AssetResponseDto[]> {
    return this.service.getAssets(authUser, id);
  }

  @Post(':id/merge')
  mergePerson(
    @AuthUser() authUser: AuthUserDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: MergePersonDto,
  ): Promise<BulkIdResponseDto[]> {
    return this.service.mergePerson(authUser, id, dto);
  }
}
